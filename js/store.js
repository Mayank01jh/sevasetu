/**
 * SevaSetu State Management & Operations Store
 * Persistent via localStorage with full auditing and role simulation
 */
(function(window) {
  'use strict';

  var STORAGE_KEY = 'sevasetu_platform_state_v1';

  var SevaSetuStore = {
    state: {
      users: [],
      currentRole: 'guest', // 'guest' | 'donor' | 'volunteer' | 'field_lead' | 'ngo_admin' | 'platform_admin'
      currentUser: null,
      ngos: [],
      campaigns: [],
      donations: [],
      volunteerOpportunities: [],
      volunteerRecords: [],
      auditLogs: [],
      cookiePreferences: {
        essential: true,
        analytics: true,
        marketing: false,
        lastUpdated: '2026-10-01'
      }
    },

    listeners: [],

    init: function() {
      try {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          var parsed = JSON.parse(saved);
          this.state.users = parsed.users || window.SEVASETU_INITIAL_DATA.users || [];
          this.state.currentUser = parsed.currentUser || null;
          this.state.currentRole = this.state.currentUser ? this.state.currentUser.role : 'guest';
          this.state.ngos = parsed.ngos || window.SEVASETU_INITIAL_DATA.ngos;
          this.state.campaigns = parsed.campaigns || window.SEVASETU_INITIAL_DATA.campaigns;
          this.state.donations = parsed.donations || window.SEVASETU_INITIAL_DATA.donations;
          this.state.volunteerOpportunities = parsed.volunteerOpportunities || window.SEVASETU_INITIAL_DATA.volunteerOpportunities;
          this.state.volunteerRecords = parsed.volunteerRecords || window.SEVASETU_INITIAL_DATA.volunteerRecords;
          this.state.auditLogs = parsed.auditLogs || window.SEVASETU_INITIAL_DATA.auditLogs;
          if (parsed.cookiePreferences) this.state.cookiePreferences = parsed.cookiePreferences;
        } else {
          this.resetToDefaults();
        }
      } catch (e) {
        console.warn('Storage init failed, using initial seed data', e);
        this.resetToDefaults();
      }
      this.notify();
    },

    save: function() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          users: this.state.users,
          currentUser: this.state.currentUser,
          currentRole: this.state.currentRole,
          ngos: this.state.ngos,
          campaigns: this.state.campaigns,
          donations: this.state.donations,
          volunteerOpportunities: this.state.volunteerOpportunities,
          volunteerRecords: this.state.volunteerRecords,
          auditLogs: this.state.auditLogs,
          cookiePreferences: this.state.cookiePreferences
        }));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      this.notify();
    },

    resetToDefaults: function() {
      var initial = window.SEVASETU_INITIAL_DATA;
      this.state.users = JSON.parse(JSON.stringify(initial.users || []));
      this.state.currentUser = null;
      this.state.currentRole = 'guest';
      this.state.ngos = JSON.parse(JSON.stringify(initial.ngos));
      this.state.campaigns = JSON.parse(JSON.stringify(initial.campaigns));
      this.state.donations = JSON.parse(JSON.stringify(initial.donations));
      this.state.volunteerOpportunities = JSON.parse(JSON.stringify(initial.volunteerOpportunities));
      this.state.volunteerRecords = JSON.parse(JSON.stringify(initial.volunteerRecords));
      this.state.auditLogs = JSON.parse(JSON.stringify(initial.auditLogs));
      this.save();
    },

    subscribe: function(callback) {
      this.listeners.push(callback);
      return function() {
        var idx = this.listeners.indexOf(callback);
        if (idx !== -1) this.listeners.splice(idx, 1);
      }.bind(this);
    },

    notify: function() {
      for (var i = 0; i < this.listeners.length; i++) {
        try {
          this.listeners[i](this.state);
        } catch (err) {
          console.error('Listener notification error:', err);
        }
      }
    },

    login: function(usernameOrEmail, password) {
      var term = (usernameOrEmail || '').trim().toLowerCase();
      var pass = (password || '').trim();

      var user = this.state.users.find(function(u) {
        return (u.email.toLowerCase() === term || u.username.toLowerCase() === term) && u.password === pass;
      });

      if (!user) {
        return { success: false, error: 'Invalid email/username or password. Please check CREDENTIALS.md.' };
      }

      this.state.currentUser = user;
      this.state.currentRole = user.role;
      this.logAudit(user.name, 'USER_LOGIN', 'Signed in as ' + user.role.toUpperCase() + ' (' + user.email + ')');
      this.save();
      return { success: true, user: user };
    },

    logout: function() {
      var prevName = this.state.currentUser ? this.state.currentUser.name : 'User';
      this.logAudit(prevName, 'USER_LOGOUT', 'User signed out from platform session');
      this.state.currentUser = null;
      this.state.currentRole = 'guest';
      this.save();
    },

    register: function(userData) {
      // userData: { name, email, password, role, phone, pan }
      var email = (userData.email || '').trim().toLowerCase();
      var exists = this.state.users.find(function(u) {
        return u.email.toLowerCase() === email;
      });

      if (exists) {
        return { success: false, error: 'An account with this email address already exists.' };
      }

      var newUser = {
        id: 'usr_' + Date.now(),
        username: email,
        email: email,
        password: userData.password,
        name: userData.name || 'Registered User',
        role: userData.role || 'donor',
        title: userData.role === 'volunteer' ? 'Registered Civic Volunteer' : (userData.role === 'field_lead' ? 'Field Coordinator' : 'Verified Member'),
        phone: userData.phone || '+91 99999 88888',
        pan: (userData.pan || '').toUpperCase()
      };

      this.state.users.push(newUser);
      this.state.currentUser = newUser;
      this.state.currentRole = newUser.role;
      this.logAudit(newUser.name, 'USER_REGISTERED', 'New user registered as ' + newUser.role.toUpperCase() + ' (' + newUser.email + ')');
      this.save();
      return { success: true, user: newUser };
    },

    setRole: function(role) {
      this.state.currentRole = role;
      this.logAudit(this.state.currentUser ? this.state.currentUser.name : 'GUEST', 'ROLE_SWITCH', 'Switched session view to: ' + role.toUpperCase());
      this.save();
    },

    logAudit: function(actor, action, details) {
      var entry = {
        id: 'LOG-' + Math.floor(10000 + Math.random() * 90000),
        timestamp: new Date().toISOString(),
        actor: actor || (this.state.currentUser ? this.state.currentUser.name : 'ANONYMOUS'),
        role: this.state.currentRole.toUpperCase(),
        action: action,
        details: details,
        ip: '127.0.0.1 (Local Verified)'
      };
      this.state.auditLogs.unshift(entry);
    },

    // Utilities
    maskPan: function(pan) {
      if (!pan || pan.length < 10) return pan || 'N/A';
      return pan.substring(0, 5) + '****' + pan.substring(9);
    },

    validatePan: function(pan) {
      if (!pan) return false;
      var regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      return regex.test(pan.trim().toUpperCase());
    },

    formatCurrency: function(num) {
      if (num === null || num === undefined) return '₹0';
      return '₹' + Number(num).toLocaleString('en-IN');
    },

    formatDate: function(dateStr) {
      if (!dateStr) return 'N/A';
      var d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    // Core Business Operations
    createDonation: function(payload) {
      // payload: { campaignId, amount, paymentMethod, donorName, donorEmail, donorPhone, donorPan, donorAddress, isAnonymous }
      var campaign = this.state.campaigns.find(function(c) { return c.id === payload.campaignId; });
      if (!campaign) throw new Error('Selected campaign does not exist.');

      var ngo = this.state.ngos.find(function(n) { return n.id === campaign.ngoId; });
      if (!ngo) throw new Error('Associated NGO record missing.');

      var billNum = Math.floor(100000 + Math.random() * 900000);
      var recNum = Math.floor(1000 + Math.random() * 9000);
      var billId = 'SS-BILL-2026-' + billNum;
      var receiptId = 'SS-REC-2026-0' + recNum;

      var finalPan = (payload.donorPan || '').trim().toUpperCase();
      var has80G = campaign.is80GEligible && this.validatePan(finalPan);

      var donation = {
        billId: billId,
        receiptId: receiptId,
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        ngoId: ngo.id,
        ngoName: ngo.name,
        ngoPan: ngo.pan,
        ngo80GOrder: ngo.sec80G,
        donorName: payload.donorName || 'Generous Donor',
        donorEmail: payload.donorEmail || 'donor@sevasetu.org',
        donorPhone: payload.donorPhone || '+91 99999 99999',
        donorPan: finalPan || 'N/A',
        donorAddress: payload.donorAddress || 'India',
        isAnonymous: !!payload.isAnonymous,
        amount: Number(payload.amount),
        currency: 'INR',
        paymentMethod: payload.paymentMethod || 'UPI',
        providerRef: payload.providerRef || (payload.paymentMethod + '-TXN-' + Math.floor(10000000 + Math.random() * 90000000)),
        idempotencyKey: 'idem_' + billNum + '_' + Date.now(),
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
        is80GEligible: has80G,
        taxDeductionClaimed: has80G ? Math.round(Number(payload.amount) * 0.5) : 0,
        form10BdReady: has80G,
        qrVerificationUrl: 'https://sevasetu.org/verify/receipt?id=' + receiptId + '&bill=' + billId
      };

      // Update Campaign progress
      campaign.raisedAmount = Number(campaign.raisedAmount) + Number(payload.amount);
      campaign.donorCount = (Number(campaign.donorCount) || 0) + 1;

      // Update State
      this.state.donations.unshift(donation);

      this.logAudit(
        donation.donorName,
        'DONATION_SUCCESS',
        'Bill ' + billId + ' generated for ' + this.formatCurrency(donation.amount) + ' to ' + campaign.title
      );

      this.save();
      return donation;
    },

    // Volunteer & Field Lead Code Generation
    generateFieldSessionCode: function(opportunityId) {
      var opp = this.state.volunteerOpportunities.find(function(o) { return o.id === opportunityId; });
      if (!opp) throw new Error('Opportunity not found');

      var randomCode = 'SETU-' + Math.floor(1000 + Math.random() * 9000);
      var sessionId = 'SESS-' + Math.floor(100 + Math.random() * 900);
      var expiryTime = Date.now() + (10 * 60 * 1000); // 10 minutes

      opp.activeSession = {
        sessionId: sessionId,
        sessionToken: randomCode,
        generatedAt: Date.now(),
        expiresInSeconds: 600,
        isActive: true,
        sessionName: opp.title + ' (Active Session)'
      };

      this.logAudit(
        opp.leadName || 'Field Lead',
        'ATTENDANCE_CODE_GENERATED',
        'Generated attendance code ' + randomCode + ' for ' + opp.title + ' (10 min expiry)'
      );

      this.save();
      return opp.activeSession;
    },

    revokeFieldSessionCode: function(opportunityId) {
      var opp = this.state.volunteerOpportunities.find(function(o) { return o.id === opportunityId; });
      if (!opp || !opp.activeSession) return;

      var code = opp.activeSession.sessionToken;
      opp.activeSession.isActive = false;

      this.logAudit(
        opp.leadName || 'Field Lead',
        'ATTENDANCE_CODE_REVOKED',
        'Revoked session attendance code ' + code + ' for ' + opp.title
      );

      this.save();
    },

    checkInVolunteer: function(opportunityId, inputCode, volunteerName, volunteerEmail) {
      var opp = this.state.volunteerOpportunities.find(function(o) { return o.id === opportunityId; });
      if (!opp) throw new Error('Selected opportunity does not exist.');

      if (!opp.activeSession || !opp.activeSession.isActive) {
        throw new Error('No active attendance session for this opportunity. Please ask the Field Lead to generate an attendance code.');
      }

      if (opp.activeSession.sessionToken.toUpperCase() !== inputCode.trim().toUpperCase()) {
        throw new Error('Invalid attendance code. Please check with your Field Lead.');
      }

      var recordId = 'VOL-REC-2026-' + Math.floor(1000 + Math.random() * 9000);
      var now = new Date();
      var timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      var record = {
        recordId: recordId,
        volunteerName: volunteerName || this.state.currentUser.name,
        volunteerEmail: volunteerEmail || this.state.currentUser.email,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        ngoName: opp.ngoName,
        sessionDate: now.toISOString().split('T')[0],
        checkInTime: timeStr,
        checkOutTime: null,
        hoursLogged: opp.hoursReward || 4,
        status: 'CHECKED_IN',
        approvedBy: null,
        approvalNotes: 'Awaiting field lead checkout and sign-off.',
        certificateId: null,
        qrVerificationUrl: null
      };

      this.state.volunteerRecords.unshift(record);

      this.logAudit(
        record.volunteerName,
        'VOLUNTEER_CHECKIN',
        'Checked in to ' + opp.title + ' with verified token ' + inputCode
      );

      this.save();
      return record;
    },

    checkOutVolunteer: function(recordId) {
      var record = this.state.volunteerRecords.find(function(r) { return r.recordId === recordId; });
      if (!record) throw new Error('Record not found');

      var now = new Date();
      record.checkOutTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      record.status = 'PENDING_APPROVAL';

      this.logAudit(
        record.volunteerName,
        'VOLUNTEER_CHECKOUT',
        'Checked out from ' + record.opportunityTitle + ' at ' + record.checkOutTime
      );

      this.save();
      return record;
    },

    approveVolunteerHours: function(recordId, approvedHours, reasonNotes) {
      var record = this.state.volunteerRecords.find(function(r) { return r.recordId === recordId; });
      if (!record) throw new Error('Record not found');

      record.status = 'APPROVED';
      record.hoursLogged = Number(approvedHours);
      record.approvalNotes = reasonNotes || 'Volunteer completed required service tasks successfully.';
      record.approvedBy = this.state.currentUser.name + ' (Field Lead)';
      var certNum = Math.floor(10000 + Math.random() * 90000);
      record.certificateId = 'SEVA-CERT-2026-' + certNum;
      record.qrVerificationUrl = 'https://sevasetu.org/verify/cert?id=' + record.certificateId;

      this.logAudit(
        record.approvedBy,
        'VOLUNTEER_APPROVED',
        'Approved ' + record.hoursLogged + ' hours for ' + record.volunteerName + '. Certificate ' + record.certificateId + ' issued.'
      );

      this.save();
      return record;
    },

    // Platform Admin & NGO Verification Actions
    reviewNgoStatus: function(ngoId, newStatus, reason) {
      var ngo = this.state.ngos.find(function(n) { return n.id === ngoId; });
      if (!ngo) throw new Error('NGO not found');

      var prev = ngo.verificationStatus;
      ngo.verificationStatus = newStatus;
      ngo.reviewerNotes = reason || 'Status transitioned by Platform Admin review.';
      if (newStatus === 'VERIFIED') {
        ngo.verifiedDate = new Date().toISOString().split('T')[0];
      }

      this.logAudit(
        this.state.currentUser.name,
        'NGO_VERIFICATION_UPDATE',
        'Transitioned ' + ngo.name + ' from ' + prev + ' to ' + newStatus + '. Reason: ' + ngo.reviewerNotes
      );

      this.save();
      return ngo;
    },

    // Add new campaign from NGO Admin
    createCampaign: function(campaignData) {
      var campaignId = 'cmp-' + campaignData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 24) + '-' + Math.floor(100 + Math.random() * 900);
      var ngo = this.state.ngos.find(function(n) { return n.id === campaignData.ngoId; }) || this.state.ngos[0];

      var newCmp = {
        id: campaignId,
        ngoId: ngo.id,
        ngoName: ngo.name,
        title: campaignData.title,
        shortDesc: campaignData.shortDesc,
        fullDesc: campaignData.fullDesc,
        category: campaignData.category || 'Education & Nutrition',
        goalAmount: Number(campaignData.goalAmount),
        raisedAmount: 0,
        donorCount: 0,
        daysLeft: Number(campaignData.daysLeft) || 30,
        status: 'PUBLISHED',
        is80GEligible: !!campaignData.is80GEligible,
        deductionPercent: 50,
        bannerColor: campaignData.bannerColor || '#107361',
        fundAllocation: campaignData.fundAllocation || [
          { category: 'Direct Beneficiary Procurement', percent: 75, amount: Math.round(Number(campaignData.goalAmount) * 0.75) },
          { category: 'Field Logistics & Deployment', percent: 15, amount: Math.round(Number(campaignData.goalAmount) * 0.15) },
          { category: 'Independent Impact Audit', percent: 10, amount: Math.round(Number(campaignData.goalAmount) * 0.10) }
        ],
        milestones: campaignData.milestones || [
          { id: 'm1', title: 'Phase 1 Initial Beneficiary Enrolment', target: '25% of goal', status: 'IN_PROGRESS', date: 'Current' },
          { id: 'm2', title: 'Phase 2 Scale & Full Deployment', target: '100% of goal', status: 'PLANNED', date: 'Next Quarter' }
        ],
        impactUpdates: [
          {
            id: 'upd-' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            title: 'Campaign Launched on SevaSetu',
            text: 'Official campaign approved and verified. All incoming contributions are tracked transparently via Bill Vault.',
            author: ngo.name + ' Administration',
            verified: true
          }
        ]
      };

      this.state.campaigns.unshift(newCmp);
      this.logAudit(
        ngo.name,
        'CAMPAIGN_PUBLISHED',
        'Campaign "' + newCmp.title + '" created with target ' + this.formatCurrency(newCmp.goalAmount)
      );

      this.save();
      return newCmp;
    }
  };

  window.SevaSetuStore = SevaSetuStore;
})(window);
